import React, { ReactNode, useState } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GoStarFill } from "react-icons/go";
import { Eye, EyeOff } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // ✅ import checkbox
import { Label } from "./label";

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  field: any;
  label: string;
  placeHolder?: string;
  fieldType: "input" | "textarea" | "select" | "checkbox"; // ✅ added "checkbox"
  inputType?: "number" | "text" | "password" | "email";
  important?: boolean;
  error?: any;
  allowShowHidePassword?: boolean;
  previewImage?: string;
  options?: SelectOption[]; // used for select
  disable?: boolean;
  checkBoxLabel?:ReactNode;
}

export const CustomForm = ({
  field,
  placeHolder,
  label,
  fieldType,
  important,
  inputType = "text",
  allowShowHidePassword = false,
  previewImage,
  options = [],
  disable,
  checkBoxLabel

}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  let FieldComponent;

  switch (fieldType) {
    case "textarea":
      FieldComponent = (
        <Textarea
          placeholder={placeHolder}
          {...field}
          className="min-h-36"
          disabled={disable}
        />
      );
      break;

    case "select":
      FieldComponent = (
        <Select
          onValueChange={field.onChange}
          value={field.value}
          disabled={disable}

        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeHolder || "Select option"} />
          </SelectTrigger>
          <SelectContent className="w-full">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      break;
case "checkbox":
  FieldComponent = (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={field.name}
        checked={field.value}
        onCheckedChange={(checked) => field.onChange(checked)}
      />
      <Label htmlFor={field.name} className="text-sm leading-relaxed">
        {checkBoxLabel} 
      </Label>
    </div>
  );
  break;


    case "input":
    default:
      const isPassword = inputType === "password" && allowShowHidePassword;

      const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const parsed = val === "" ? undefined : Number(val);
        field.onChange(parsed);
      };

      FieldComponent = (
        <div className="relative">
          <Input
            placeholder={placeHolder}
            type={isPassword ? (showPassword ? "text" : "password") : inputType}
            {...field}
            onChange={
              inputType === "number" ? handleNumberChange : field.onChange
            }
            value={
              inputType === "number" &&
              (field.value === undefined || field.value === null)
                ? ""
                : field.value
            }
            disabled={disable}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      );
      break;
  }

  return (
    <FormItem>
      <FormLabel className="text-accent-foreground flex gap-x-2 items-start">
        {label}
        {important && (
          <div className="p-0.5 rounded-full">
            <GoStarFill className="size-1.5 text-rose-600 dark:text-rose-800" />
          </div>
        )}
      </FormLabel>
      <FormControl>{FieldComponent}</FormControl>
      <FormMessage className="text-sm" />
    </FormItem>
  );
};
