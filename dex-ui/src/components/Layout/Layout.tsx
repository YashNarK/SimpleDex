import { Grid, GridItem } from "@chakra-ui/react";
import Header from "../Header";
import Swap from "../Swap";
import Liquidity from "../Liquidity";
import Info from "../Info";
import Footer from "../Footer";

const Layout = () => {
  return (
    <Grid
      gridTemplateAreas={{
        base: `"header"
              "swap"
              "liquidity"
              "info"
              "footer"
              `,
        md: `"header header"
             "swap liquidity"           
             "info info"
             "footer footer"`,
      }}
      gridTemplateRows={{
        base: `300px 300px 600px 1fr 50px`,
        md: `150px 1fr 1fr 50px`,
      }}
      gridTemplateColumns={{
        base: `1fr`,
        md: `1fr 1fr`,
      }}
      gap={"5px"}
      p={"10px"}
    >
      <GridItem area={"header"}>
        <Header></Header>
      </GridItem>
      <GridItem area={"swap"}>
        <Swap></Swap>
      </GridItem>
      <GridItem area={"liquidity"}>
        <Liquidity></Liquidity>
      </GridItem>
      <GridItem area={"info"}>
        <Info />
      </GridItem>
      <GridItem area={"footer"}>
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default Layout;
