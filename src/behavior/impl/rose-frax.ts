import { RoseJar } from "./rose-jar";

const ROSE_FRAX_REWARDS = "0x9b2aE7d53099Ec64e2f6df3B4151FFCf7205f788";

export class PadRoseFrax extends RoseJar {
  constructor() {
    super(ROSE_FRAX_REWARDS);
  }
}
