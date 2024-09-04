"use client";
import { useCallback, useRef, useEffect, ReactNode, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import customStyle from './RouteModal.module.scss'
import clsx from "clsx";
import { AiOutlineClose } from "react-icons/ai";

const RouteModal = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
    const overlay = useRef<HTMLDivElement | null>(null);
    const wrapper = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const onDismiss = useCallback(() => {
        router.back();
    }, [router]);

    const onClick = useCallback(
        (e: MouseEvent) => {
            if (e.target === overlay.current || e.target === wrapper.current) {
                if (onDismiss) onDismiss();
            }
        },
        [onDismiss, overlay, wrapper]
    );

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onDismiss();
        },
        [onDismiss]
    );

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onKeyDown]);

    return (
        <div className="modal modal-bottom sm:modal-middle modal-open" ref={overlay} onClick={onClick}>
            <div className={clsx(customStyle.container, "modal-box", className)} ref={wrapper}>
                <button onClick={_ => onDismiss()} className="absolute top-4 right-4"><AiOutlineClose className="h-6 w-6" /></button>
                {children}
            </div>
        </div>
    );
}

export default RouteModal