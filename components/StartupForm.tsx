'use client'

import React, { useState, useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import { formSchema } from "@/lib/validat";
import { toast } from "sonner";


function StartupForm() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState("");
    const router = useRouter();

    const handleFormSubmit = async (prevState: { success: boolean }, formData: FormData) => {
        try {
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                link: formData.get("link") as string,
                pitch,
            };

            // 验证表单数据
            await formSchema.parseAsync(formValues);

            const response = await fetch("/api/startup-add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formValues),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success("Your startup has been submitted successfully!");

                // 跳转到新创建的startup详情页
                router.push(`/startup/${result.startup._id}`);
            } else {
                throw new Error(result.error || "Failed to submit startup");
            }

            return { success: true };
        } catch (error: unknown) {
            console.error("Form submission error:", error);

            if (error && typeof error === 'object' && 'errors' in error) {
                // Zod validation errors
                const fieldErrors: Record<string, string> = {};
                const zodError = error as { errors: Array<{ path?: string[]; message: string }> };
                zodError.errors.forEach((err) => {
                    if (err.path && err.path.length > 0) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                const errorMessage = error instanceof Error ? error.message : "Failed to submit startup. Please try again.";
                toast.error(errorMessage);
            }
            return { success: false };
        }
    };

    const [, formAction, isPending] = useActionState(handleFormSubmit, { success: false });

    return (
        <form action={formAction} className="startup-form">
            <div>
                <label htmlFor="title" className="startup-form_label">
                    Title
                </label>
                <Input
                    id="title"
                    name="title"
                    className="startup-form_input"
                    required
                    placeholder="Startup Title"
                />

                {errors.title && <p className="startup-form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="startup-form_label">
                    Description
                </label>
                <Textarea
                    id="description"
                    name="description"
                    className="startup-form_textarea"
                    required
                    placeholder="Startup Description"
                />

                {errors.description && (
                    <p className="startup-form_error">{errors.description}</p>
                )}
            </div>

            <div>
                <label htmlFor="category" className="startup-form_label">
                    Category
                </label>
                <Input
                    id="category"
                    name="category"
                    className="startup-form_input"
                    required
                    placeholder="Startup Category (Tech, Health, Education...)"
                />

                {errors.category && (
                    <p className="startup-form_error">{errors.category}</p>
                )}
            </div>

            <div>
                <label htmlFor="link" className="startup-form_label">
                    Image URL
                </label>
                <Input
                    id="link"
                    name="link"
                    className="startup-form_input"
                    required
                    placeholder="Startup Image URL"
                />

                {errors.link && <p className="startup-form_error">{errors.link}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="pitch" className="startup-form_label">
                    Pitch
                </label>

                <MDEditor
                    value={pitch}
                    onChange={(value) => setPitch(value as string)}
                    id="pitch"
                    preview="edit"
                    height={300}
                    className="startup-form_editor"
                    style={{ borderRadius: 20, overflow: "hidden" }}
                    textareaProps={{
                        placeholder:
                            "Briefly describe your idea and what problem it solves",
                    }}
                    previewOptions={{
                        disallowedElements: ["style"],
                    }}
                />

                {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
            </div>

            <Button
                type="submit"
                className="startup-form_btn text-white"
                disabled={isPending}
            >
                {isPending ? "Submitting..." : "Submit Your Pitch"}
                <Send className="size-6 ml-0" />
            </Button>
        </form>
    )
}

export default StartupForm