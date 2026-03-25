"use client";
import { createPortal } from "react-dom";

export const BodyPortal = ({ children }) => {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
};
