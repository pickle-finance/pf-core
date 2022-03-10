import { multiSushiStrategyAbi } from "../../Contracts/ABIs/multi-sushi-strategy.abi";
import { AuroraTriEcosystemJar } from "./aurora-tri-ecosystem-jar";

export class TriSolaceNear extends AuroraTriEcosystemJar {
  constructor() {
    super(multiSushiStrategyAbi, 4, 2);
  }
}