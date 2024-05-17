import React from "react";
import { Separator } from "./ui/separator"; // Importing a pre-defined Separator component from the UI components library
import { cn } from "@/lib/utils"; // Importing a utility function for conditional class name concatenation

/**
 * A React component that renders content with a horizontal separator above and below the content.
 * It accepts optional className props to customize the styling of the container div around the children.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Optional custom class name(s) to be applied to the content container.
 * @param {React.ReactNode} props.children - The content to be displayed between the separators.
 * @returns {React.ReactElement} - A React element containing the separators and the children wrapped within a div.
 */
export default function Seprator({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Separator className="my-4 w-full px-0 bg-gray-300 h-[1.5px]" />
      <div className={cn("", className)}>{children}</div>
      <Separator className="my-4 w-full px-0 bg-gray-300 h-[1.5px] py-[1px] " />
    </>
  );
}
