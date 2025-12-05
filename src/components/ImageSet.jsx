import React, { useState, useEffect, useCallback } from "react";
import "./ImageSet.css";

const MAX_RETRIES = 3;

const ImageCircle = ({ index, image, onFinalStatus }) => {
  const hasUrl = image && image.url;

  const initialStatus = () => {
    if (!image || !hasUrl) return "placeholder";
    if (image.error) return "error";
    if (image.ready) return "loading";
    return "placeholder";
  };

  const [status, setStatus] = useState(initialStatus());
  const [retryCount, setRetryCount] = useState(0);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    setRetryCount(0);
    setVersion(0);
    setStatus(initialStatus());
  }, [image?.url]);

  useEffect(() => {
    if (["ready", "error", "placeholder"].includes(status)) {
      onFinalStatus(index, status);
    }
  }, [status]);

  const onLoad = () => setStatus("ready");

  const onError = () => {
    if (!image || image.error || !hasUrl) return setStatus("error");

    if (retryCount < MAX_RETRIES) {
      setStatus("retrying");
      setRetryCount((n) => n + 1);
    } else {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status !== "retrying") return;

    const timer = setTimeout(() => {
      setVersion((v) => v + 1);
      setStatus("loading");
    }, 5000);

    return () => clearTimeout(timer);
  }, [status]);

  const tooltip = `
Slot: ${index + 1}
Status: ${status}
Retries: ${retryCount}/${MAX_RETRIES}
Ready: ${image?.ready}
Error: ${image?.error}
  `;

  const showImg = image && hasUrl && ["loading", "retrying", "ready"].includes(status);
  const showSpinner = ["loading", "retrying"].includes(status);

  return (
    <div className="circle-wrapper">
      <div className={`circle ${status}`}>
        {showImg && (
          <img
            key={version}
            src={image.url}
            alt=""
            onLoad={onLoad}
            onError={onError}
          />
        )}

        {!image && <div className="placeholder">+</div>}

        {status === "error" && <span className="error-icon">!</span>}

        {showSpinner && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      <div className="tooltip">
        {tooltip.split("\n").map((t, i) => <div key={i}>{t}</div>)}
      </div>
    </div>
  );
};

export default function ImageSet({ name, count, images }) {
  const [finalStatus, setFinalStatus] = useState(["placeholder", "placeholder", "placeholder", "placeholder"]);

  const handleFinal = useCallback((i, s) => {
    setFinalStatus((prev) => {
      const next = [...prev];
      next[i] = s;
      return next;
    });
  }, []);

  const slots = [images[0], images[1], images[2], images[3]];

  const hasAnyError = finalStatus.includes("error") || images.some((img) => img?.error);

  return (
    <div className="card">
      <div className="header">
        <div>
          <div className="name">{name}</div>
          <div className="count">Images: {count}</div>
        </div>

        {hasAnyError && <div className="big-error">!</div>}
      </div>

      <div className="row">
        {slots.map((img, i) => (
          <ImageCircle key={i} index={i} image={img} onFinalStatus={handleFinal} />
        ))}
      </div>
    </div>
  );
}
