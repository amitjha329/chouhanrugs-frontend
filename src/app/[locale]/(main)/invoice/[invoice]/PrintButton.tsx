'use client'
import React from 'react'
import { FaPrint } from 'react-icons/fa'
function printSpecificElement() {
    const printableArea = document.getElementById('printableArea');
    if (!printableArea) return;

    const originalBody = document.body.innerHTML; // Store original body content

    // Replace body content with only the printable area
    document.body.innerHTML = printableArea.innerHTML;

    window.print(); // Trigger the print dialog

    // Restore original body content after printing
    document.body.innerHTML = originalBody;
}
export default function PrintButton({ className }: { className: string }) {
    return (
        <button onClick={() => printSpecificElement()} className={className}>
            <FaPrint /> Print Invoice
        </button>
    )
}
