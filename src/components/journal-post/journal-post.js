import React, { useState, useCallback, useEffect } from "react";
import { Link } from "gatsby";
import Layout from "../layout/layout";
import * as styles from "./journal-post.module.css";
import { formatExif } from "./format-exif";

export default function JournalPost({ pageContext }) {
  const post = pageContext.post;
  const mainImageUrl = post.mainImage?.url;
  const galleryImages = (post.gallery?.images || []).filter((img) => img.url);
  const [lightboxIndex, setLightboxIndex] = useState(null);

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
      <div className={styles.journalPost}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Home</Link>
          <span> / </span>
          <Link to="/journal">Journal</Link>
          <span> / </span>
          <span>{post.title}</span>
        </nav>

        <h1>{post.title}</h1>

        {mainImageUrl && (
          <figure className={styles.mainImage}>
            <img
              src={`${mainImageUrl}?w=1200&auto=format`}
              alt={post.mainImage?.alt || post.title}
              loading="eager"
              onClick={() => openLightbox(0)}
            />
            {allImages[0].caption && (
              <figcaption className={styles.caption}>
                {allImages[0].caption}
              </figcaption>
            )}
          </figure>
        )}

        {galleryImages.length > 0 && (
          <div className={styles.gallery}>
            {galleryImages.map((img, i) => {
              const caption = formatExif(img.exif);
              return (
                <figure
                  key={i}
                  className={styles.galleryItem}
                  onClick={() => openLightbox(mainImageUrl ? i + 1 : i)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && openLightbox(mainImageUrl ? i + 1 : i)
                  }
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={`${img.url}?w=600&auto=format`}
                    alt={post.title}
                    loading="lazy"
                  />
                  {caption && (
                    <figcaption className={styles.caption}>
                      {caption}
                    </figcaption>
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
      </div>
    </Layout>
  );
}
