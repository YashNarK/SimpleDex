// src/hooks/useCustomToast.ts
import { useToast } from "@chakra-ui/react";

type ToastConfigType = {
  status: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
};

const useCustomToast = () => {
  const toast = useToast();

  const showToast = (config: ToastConfigType) => {
    const { status, title, description, duration = 2000 } = config;
    toast({
      status,
      title,
      description,
      duration,
      isClosable: true,
      position: "top",
    });
  };

  return showToast;
};

export default useCustomToast;
