import { Box } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      textAlign={"center"}
      alignContent={"center"}
      bg={"Cornsilk"}
      textColor={"Navy"}
      fontSize={{ base: "medium", md: "large" }}
      h={"100%"}
      w={"100%"}
    >
      © 2024 YashNarK. All rights reserved.
    </Box>
  );
};

export default Footer;
