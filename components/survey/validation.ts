import { Question } from "@/types/survey";
import { z } from "zod";

export function createSurveyValidationSchema(questions: Question[]) {
  const shape = questions.reduce((acc, question) => {
    let schema: any;

    switch (question.type) {
      case "text":
      case "radio":
      case "singleselect":
        schema = z.string()
        if (question.required) {
          schema = schema.min(1, { message: "This field is required." });
        } else {
          // Allow empty string for optional text inputs
          schema = schema.optional().or(z.literal(""));
        }
        break;

      case "checkbox":
      case "multiselect":
        schema = z.array(z.string());
        if (question.required) {
          schema = schema.nonempty({
            message: "Please select at least one option.",
          });
        }
        break;

      case "date":
        if (question.required) {
          schema = z.coerce.date({
            errorMap: () => ({ message: "Please select a valid date." }),
          });
        } else {
          // Allow null/undefined for optional dates
          schema = z.coerce.date().nullable().optional();
        }
        break;

      case "rating":
        schema = z.number().int().min(1, "A rating is required.");
        if (!question.required) {
          schema = schema.optional();
        }
        break;

      default:
        schema = z.any().optional();
    }

    acc[question.id] = schema;
    return acc;
  }, {} as Record<string, z.ZodTypeAny>);

  return z.object(shape);
}