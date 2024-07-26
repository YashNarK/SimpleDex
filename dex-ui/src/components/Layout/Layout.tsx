import { Grid, GridItem } from "@chakra-ui/react";
import Header from "../Header";
import Swap from "../Swap";
import Liquidity from "../Liquidity";
import Info from "../Info";

const Layout = () => {
  return (
    <Grid
      gridTemplateAreas={{
        base: `"header"
              "swap"
              "liquidity"
              "info"`,
        md: `"header header"
             "swap liquidity"           
             "info info"`,
      }}
      gridTemplateRows={`100px 1fr 1fr`}
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
    </Grid>
  );
};

export default Layout;
