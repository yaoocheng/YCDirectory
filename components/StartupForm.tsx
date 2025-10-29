'use client'

import React, { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, ArrowBigLeft  } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import { formSchema } from "@/lib/validat";
import { toast } from "sonner";
import { Startup } from "@/types";

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

function StartupForm({ postData }: { postData?: Startup | null }) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [link, setLink] = useState("");
    const [pitch, setPitch] = useState("");
    const router = useRouter();

    // 回填已有数据
    useEffect(() => {
        if (postData) {
            setTitle(postData.title || "");
            setDescription(postData.description || "");
            setCategory(postData.category || "");
            setLink(postData.image || "");
            setPitch(postData.pitch || "");
        }
    }, [postData]);

    const handleFormSubmit = async () => {
        try {
            const formValues = {
                id: postData?._id || "",
                title,
                description,
                category,
                link,
                pitch,
            };

            setErrors({});

            await formSchema.parseAsync(formValues);

            const response = await fetch(`/api/startup-add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success(postData ? "更新成功！" : "创建成功！");
                router.push(`/startup/${result.startup._id}`);
            } else {
                throw new Error(result.error || "Failed to submit startup");
            }

            return { success: true };
        } catch (error: unknown) {
            console.error("Form submission error:", error);

            if (error && typeof error === 'object' && 'issues' in error) {
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
                const errorMessage = error instanceof Error ? error.message : "提交失败，请重试";
                toast.error(errorMessage);
            }
            return { success: false };
        }
    };

    const [, formAction, isPending] = useActionState(handleFormSubmit, { success: false });

    return (
        <form action={formAction} className="startup-form">
            <ArrowBigLeft
                className="cursor-pointer transition-transform hover:scale-110 text-black-200 size-8 fill-black-200"
                onClick={() => router.back()}
            />

            <div>
                <label htmlFor="title" className="startup-form_label">项目标题</label>
                <Input
                    id="title"
                    name="title"
                    className="startup-form_input"
                    required
                    placeholder="输入您的项目标题"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <p className="startup-form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="startup-form_label">项目描述</label>
                <Textarea
                    id="description"
                    name="description"
                    className="startup-form_textarea"
                    required
                    placeholder="输入您的项目描述"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <p className="startup-form_error">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="category" className="startup-form_label">项目分类</label>
                <Select name="category" required value={category} onValueChange={setCategory}>
                    <SelectTrigger className="startup-form_select">
                        <SelectValue placeholder="选择项目分类" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        {projectCategories.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category && <p className="startup-form_error">{errors.category}</p>}
            </div>

            <div>
                <label htmlFor="link" className="startup-form_label">项目图片链接</label>
                <Input
                    id="link"
                    name="link"
                    className="startup-form_input"
                    required
                    placeholder="输入项目图片链接"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                {errors.link && <p className="startup-form_error">{errors.link}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="pitch" className="startup-form_label">想法展示</label>
                <MDEditor
                    value={pitch}
                    onChange={(val) => setPitch(val || "")}
                    id="pitch"
                    preview="edit"
                    height={300}
                    className="startup-form_editor"
                    style={{ borderRadius: 20, overflow: "hidden" }}
                    textareaProps={{ placeholder: "简单介绍一下你的想法，以及它要解决的问题" }}
                    previewOptions={{ disallowedElements: ["style"] }}
                />
                {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
            </div>

            <Button type="submit" className="startup-form_btn text-white" disabled={isPending}>
                {isPending ? "提交中..." : postData ? "更新" : "创建"}
                <Send className="size-6 ml-0" />
            </Button>
        </form>
    );
}

export default StartupForm;
