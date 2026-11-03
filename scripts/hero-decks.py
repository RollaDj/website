#!/usr/bin/env python3
"""
Hero : prépare la photo « ROLLA derrière ses platines » (première image du hero).

  1. Détourage : Robust Video Matting (personne) + écart au mur uni (contrôleur,
     branches des lunettes), puis nettoyage des bords (pas de liseré clair).
  2. Fondus intégrés sur les côtés et le bas, là où le cadre de la photo coupe
     le contrôleur.
  3. Export WebP transparent sans perte, à la résolution d'origine.
  4. Calage sur l'image de début de boucle de la vidéo trompette
     (public/media/hero/rolla-cutout-loop.webp) : affiche les valeurs `fit`,
     `width` et `height` à reporter dans `heroDecks` (src/content/media.ts).

Prérequis : Python 3.10+, `pip install numpy opencv-python-headless onnxruntime`
et le modèle rvm_resnet50_fp32.onnx (https://github.com/PeterL1n/RobustVideoMatting,
section « Download », ONNX). Photo : fond uni et clair, de la tête au contrôleur.

Usage :
  python3 scripts/hero-decks.py photo.jpg --model rvm_resnet50_fp32.onnx
  (options : --decks-top 0.8 = début du contrôleur, en fraction de la hauteur)
"""
import argparse
import os

import cv2
import numpy as np
import onnxruntime as ort

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public/media/hero/rolla-decks.webp")
LOOP = os.path.join(ROOT, "public/media/hero/rolla-cutout-loop.webp")


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def matte_person(rgb, model):
    """RVM sur une image fixe (répétée pour stabiliser l'état récurrent)."""
    sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
    x = (rgb.astype(np.float32) / 255).transpose(2, 0, 1)[None]
    rec = [np.zeros([1, 1, 1, 1], np.float32)] * 4
    ratio = np.array([min(1.0, 360 / max(rgb.shape[:2]))], np.float32)
    for _ in range(10):
        _, pha, *rec = sess.run(None, {"src": x, "r1i": rec[0], "r2i": rec[1], "r3i": rec[2], "r4i": rec[3], "downsample_ratio": ratio})
    return np.clip(pha[0, 0], 0, 1)


def cutout(I, a_rvm, decks_top):
    H, W = I.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    u, v = xx / W, yy / H
    # Mur : surface polynomiale (degré 3) ajustée sur les pixels de mur.
    far = cv2.dilate((a_rvm > 0.02).astype(np.uint8), np.ones((25, 25), np.uint8)) == 0
    wall = far & (v < decks_top - 0.02)
    terms = [np.ones_like(u), u, v, u * u, u * v, v * v, u**3, u * u * v, u * v * v, v**3]
    A = np.stack([t[wall] for t in terms], 1)
    B = np.zeros_like(I)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, I[..., c][wall], rcond=None)
        B[..., c] = sum(k * t for k, t in zip(coef, terms))
    d = np.linalg.norm(I - B, axis=2)
    a_diff = cv2.morphologyEx(np.clip((d - 22) / 33, 0, 1), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    # Près de la silhouette (lunettes, câble) ; jamais les ombres lointaines.
    near = cv2.dilate((a_rvm > 0.3).astype(np.uint8), np.ones((15, 15), np.uint8)).astype(bool)
    # Contrôleur : sombre, en bas ; plein (boutons clairs et logo inclus).
    dark = np.clip((165 - I.mean(axis=2)) / 45, 0, 1)
    a_ctrl = a_diff * dark * ((v > decks_top) & ~near)
    blob = cv2.morphologyEx((a_ctrl > 0.5).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    cnts, _ = cv2.findContours(blob, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    solid = np.zeros((H, W), np.uint8)
    cv2.drawContours(solid, [c for c in cnts if cv2.contourArea(c) > 0.006 * H * W], -1, 1, -1)
    a_ctrl = np.maximum(a_ctrl, cv2.erode(solid, np.ones((3, 3), np.uint8)).astype(np.float32))
    a = np.maximum(a_rvm, np.maximum(a_diff * near, a_ctrl))
    # Composante principale uniquement.
    n, lab, st, _ = cv2.connectedComponentsWithStats((a > 0.5).astype(np.uint8), 8)
    keep = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    a *= cv2.dilate((lab == keep).astype(np.uint8), np.ones((5, 5), np.uint8))
    # Bords resserrés d'environ 1 px (pas de liseré du mur).
    a = cv2.GaussianBlur(a, (0, 0), 0.6)
    a = np.minimum(a, cv2.GaussianBlur(cv2.erode(a, np.ones((3, 3), np.uint8)), (0, 0), 0.7))
    a = np.clip((a - 0.12) / 0.88, 0, 1)
    # Décontamination : retire la couleur du mur mélangée aux bords.
    F = (I - (1 - a[..., None]) * B) / np.maximum(a[..., None], 0.08)
    C = np.where(((a > 0.02) & (a < 0.97))[..., None], np.clip(F, 0, 255), I)
    # Fondus : côtés et bas (contrôleur coupé par le cadre de la photo).
    x = (np.arange(W) + 0.5) / W
    y = (np.arange(H) + 0.5) / H
    a *= smooth(0, 0.14, x)[None] * smooth(0, 0.14, 1 - x)[None] * smooth(0, 0.12, 1 - y)[:, None]
    # Couleur étendue sous les zones transparentes (pas de liseré au redimensionnement).
    prem = C * a[..., None]
    fill = cv2.GaussianBlur(prem, (0, 0), 6) / np.maximum(cv2.GaussianBlur(a, (0, 0), 6), 1e-3)[..., None]
    C = np.where((a > 0.01)[..., None], C, fill)
    return np.dstack([C, a * 255]).round().clip(0, 255).astype(np.uint8)


def fit(decks_alpha, loop_alpha):
    """Échelle et position qui superposent au mieux les deux têtes (IoU)."""
    T = loop_alpha > 127
    D = decks_alpha > 127
    H, W = T.shape
    tt = np.nonzero(T)[0].min()
    dt = np.nonzero(D)[0].min()
    R = int(0.156 * H)  # tête et cou
    best = (0, 1, 0)
    for s in np.arange(0.5, 6, 0.02) * (W / D.shape[1]):
        Ds = cv2.resize(D.astype(np.uint8), None, fx=s, fy=s, interpolation=cv2.INTER_NEAREST).astype(bool)
        reg_d = Ds[int(round(dt * s)) : int(round(dt * s)) + R]
        reg_t = T[tt : tt + R]
        if reg_d.shape[0] < R:
            continue
        for off in range(-W // 4, W // 4 + 1, 4):
            x0 = off + (W - Ds.shape[1]) // 2
            canvas = np.zeros_like(reg_t)
            xa, xb = max(0, x0), min(W, x0 + Ds.shape[1])
            if xb <= xa:
                continue
            canvas[:, xa:xb] = reg_d[:, xa - x0 : xb - x0]
            iou = (canvas & reg_t).sum() / max(1, (canvas | reg_t).sum())
            if iou > best[0]:
                best = (iou, s, x0)
    iou, s, x0 = best
    return iou, D.shape[1] * s / W, x0 / W, (tt - dt * s) / H


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("photo")
    ap.add_argument("--model", required=True, help="rvm_resnet50_fp32.onnx")
    ap.add_argument("--decks-top", type=float, default=0.8, help="début du contrôleur (fraction de la hauteur)")
    args = ap.parse_args()

    I = cv2.imread(args.photo)
    if I is None:
        raise SystemExit(f"Image illisible : {args.photo}")
    a_rvm = matte_person(cv2.cvtColor(I, cv2.COLOR_BGR2RGB), args.model)
    rgba = cutout(I.astype(np.float32), a_rvm, args.decks_top)
    cv2.imwrite(OUT, rgba, [cv2.IMWRITE_WEBP_QUALITY, 101])  # 101 : sans perte
    H, W = rgba.shape[:2]
    print(f"Écrit : {os.path.relpath(OUT, ROOT)} ({W} × {H})")

    loop = cv2.imread(LOOP, cv2.IMREAD_UNCHANGED)
    iou, width, left, top = fit(rgba[..., 3], loop[..., 3])
    print(f"Calage (têtes superposées à {iou:.0%}) — à reporter dans heroDecks :")
    print(f"  width: {W},\n  height: {H},\n  fit: {{ width: {width:.3f}, left: {left:.3f}, top: {top:.4f} }},")


if __name__ == "__main__":
    main()
