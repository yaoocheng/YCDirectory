'use client'

import React, { useState, useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import { formSchema } from "@/lib/validat";
import { toast } from "sonner";

const projectCategories = [
  { value: "技术", label: "技术" },
  { value: "健康", label: "健康" },
  { value: "教育", label: "教育" },
  { value: "金融", label: "金融" },
  { value: "消费品", label: "消费品" },
  { value: "企业服务", label: "企业服务" },
  { value: "文化娱乐", label: "文化娱乐" },
  { value: "生活服务", label: "生活服务" },
  { value: "能源环保", label: "能源环保" },
  { value: "人工智能", label: "人工智能" },
  { value: "社会公益", label: "社会公益" },
  { value: "其他", label: "其他" },
];


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

            // 清除之前的错误
            setErrors({});

            // 验证表单数据
            await formSchema.parseAsync(formValues);

            const response = await fetch(`/api/startup-add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formValues),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success("您的创业想法已成功提交！");

                // 跳转到新创建的startup详情页
                router.push(`/startup/${result.startup._id}`);
            } else {
                throw new Error(result.error || "Failed to submit startup");
            }

            return { success: true };
        } catch (error: unknown) {
            console.error("Form submission error:", error);

            if (error && typeof error === 'object' && 'issues' in error) {
                // Zod validation errors - 正确的属性名是 'issues' 不是 'errors'
                const fieldErrors: Record<string, string> = {};
                const zodError = error as { issues: Array<{ path: string[]; message: string }> };
                zodError.issues.forEach((issue) => {
                    if (issue.path && issue.path.length > 0) {
                        fieldErrors[issue.path[0]] = issue.message;
                    }
                });
                setErrors(fieldErrors);
                toast.error("请检查表单中的错误信息");
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
                    项目标题
                </label>
                <Input
                    id="title"
                    name="title"
                    className="startup-form_input"
                    required
                    placeholder="输入您的项目标题"
                />

                {errors.title && <p className="startup-form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="startup-form_label">
                    项目描述
                </label>
                <Textarea
                    id="description"
                    name="description"
                    className="startup-form_textarea"
                    required
                    placeholder="输入您的项目描述"
                />

                {errors.description && (
                    <p className="startup-form_error">{errors.description}</p>
                )}
            </div>

            <div>
                <label htmlFor="category" className="startup-form_label">
                    项目分类
                </label>
                <Select name="category" required>
                    <SelectTrigger className="startup-form_select">
                        <SelectValue placeholder="选择项目分类" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        {projectCategories.map((category) => (
                            <SelectItem className="text-black text-base" key={category.value} value={category.value}>
                                {category.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {errors.category && (
                    <p className="startup-form_error">{errors.category}</p>
                )}
            </div>

            <div>
                <label htmlFor="link" className="startup-form_label">
                    项目图片链接
                </label>
                <Input
                    id="link"
                    name="link"
                    className="startup-form_input"
                    required
                    placeholder="输入项目图片链接（如：https://example.com/image.jpg）"
                />

                {errors.link && <p className="startup-form_error">{errors.link}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="pitch" className="startup-form_label">
                    想法展示
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
                            "简单介绍一下你的想法，以及它要解决的问题",
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
                {isPending ? "提交中..." : "提交"}
                <Send className="size-6 ml-0" />
            </Button>
        </form>
    )
}

export default StartupForm