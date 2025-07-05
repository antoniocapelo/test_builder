"use client";

import { useEffect, useState } from "react";
import z from "zod";

type FormErrors = z.ZodFormattedError<
    Record<string, any>
> | null

/**
 * Reusable logic for dealing with form validations. A schema is provided and the hook centralizes the error state management, resetting errors, and imperative validation
 */
export function useZodFormValidation(currSchema?: z.ZodSchema): {
    errors: FormErrors;
    resetError: (field: string) => void;
    validate: (values: unknown) => boolean;
} {
    const [schema, setSchema] = useState(currSchema);
    const [errors, setErrors] = useState<FormErrors>(null);

    useEffect(() => {
        setSchema(currSchema);
    }, [currSchema]);


    const validate = (values: unknown) => {
        if (!schema) {
            return true
        }

        const result = schema.safeParse(values);

        if (!result.success) {
            const newErrors = result.error.format() as FormErrors;
            setErrors(newErrors);
            return false;
        }

        setErrors(null)
        return true
    }

    const resetError = (field: string) => {
        if (errors) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
    }


    return {
        errors,
        validate,
        resetError,
    }
}