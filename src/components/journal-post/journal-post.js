import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "gatsby";
import Layout from "../layout/layout";
import * as styles from "./journal-post.module.css";
import { formatExif } from "./format-exif";
import { useVariedMasonry } from "./use-varied-masonry";

export default function JournalPost({ pageContext }) {
  const post = pageContext.post;
  const mainImageUrl = post.mainImage?.url;
  const galleryImages = (post.gallery?.images || []).filter((img) => img.url);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryRef = useRef(null);
  useVariedMasonry(
    galleryRef,
    galleryImages.map((img) => img.size),
    styles.masonryReady
  );

  const allImages = [
    ...(mainImageUrl
      ? [
          {
            url: mainImageUrl,
            alt: post.mainImage?.alt || post.title,
            caption: formatExif(post.mainImage?.exif),
          },
        ]
      : []),
    ...galleryImages.map((img) => ({
      url: img.url,
      alt: post.title,
      caption: formatExif(img.exif),
    })),
  ];

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % allImages.length);
    }
  }, [lightboxIndex, allImages.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + allImages.length) % allImages.length
      );
    }
  }, [lightboxIndex, allImages.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, goNext, goPrev]);

  return (
    <Layout>
      <article className="wrap ed" style={{ paddingBottom: "clamp(4rem, 9vw, 9rem)" }}>
        <nav className="postcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link to="/journal">Journal</Link>
          <span aria-hidden="true"> / </span>
          <span>{post.title}</span>
        </nav>

        <header className="pagehead" style={{ paddingTop: "clamp(1.5rem, 4vw, 3rem)" }}>
          <span className="kicker">Journal</span>
          <h1 className="h-xl" style={{ marginTop: "0.8rem" }}>
            {post.title}
          </h1>
          {(post.publishedAt || allImages.length > 0) && (
            <div className="postmeta">
              {post.publishedAt && <span className="mono">{post.publishedAt}</span>}
              {allImages.length > 0 && (
                <span className="mono">
                  {allImages.length} {allImages.length === 1 ? "photo" : "photos"}
                </span>
              )}
            </div>
          )}
        </header>

        {mainImageUrl && (
          <figure className={styles.hero}>
            <button
              type="button"
              className="posthero"
              onClick={() => openLightbox(0)}
              aria-label="Open photo"
            >
              <img
                src={`${mainImageUrl}?w=1600&auto=format`}
                alt={post.mainImage?.alt || post.title}
                width={post.mainImage?.size?.width}
                height={post.mainImage?.size?.height}
                loading="eager"
              />
            </button>
            {allImages[0].caption && (
              <figcaption className={styles.caption}>
                {allImages[0].caption}
              </figcaption>
            )}
          </figure>
        )}

        {galleryImages.length > 0 && (
          <div
            ref={galleryRef}
            className={`gallery ${styles.masonry}`}
          >
            {galleryImages.map((img, i) => {
              const caption = formatExif(img.exif);
              const index = mainImageUrl ? i + 1 : i;
              return (
                <figure key={img.url} className={`gal-item ${styles.galleryItem}`}>
                  <button
                    type="button"
                    className="media"
                    onClick={() => openLightbox(index)}
                    aria-label={`Open photo ${index + 1}`}
                  >
                    <img
                      src={`${img.url}?w=800&auto=format`}
                      srcSet={`${img.url}?w=800&auto=format 800w, ${img.url}?w=1400&auto=format 1400w`}
                      sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                      alt={post.title}
                      width={img.size?.width}
                      height={img.size?.height}
                      loading="lazy"
                    />
                  </button>
                  {caption && (
                    <figcaption className={styles.caption}>{caption}</figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <div
            className={`${styles.lightbox} lightbox-enter`}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
          >
            <button
              className={styles.lightboxClose}
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ×
            </button>
            <button
              className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
            <figure
              className={styles.lightboxFigure}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${allImages[lightboxIndex].url}?w=1600&auto=format`}
                alt={allImages[lightboxIndex].alt}
                className={styles.lightboxImage}
              />
              {allImages[lightboxIndex].caption && (
                <figcaption className={styles.lightboxCaption}>
                  {allImages[lightboxIndex].caption}
                </figcaption>
              )}
            </figure>
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNext}`}
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
            >
              ›
            </button>
            <span className={styles.lightboxCounter}>
              {lightboxIndex + 1} / {allImages.length}
            </span>
          </div>
        )}
      </article>
    </Layout>
  );
}
