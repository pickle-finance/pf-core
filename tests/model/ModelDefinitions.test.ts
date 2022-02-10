import { JarBehaviorDiscovery } from "../../src/behavior/JarBehaviorDiscovery";
import { ALL_ASSETS } from "../../src/model/JarsAndFarms";
import { AssetEnablement, AssetType } from "../../src/model/PickleModelJson";
import { ExternalTokenModelSingleton } from "../../src/price/ExternalTokenModel";

describe("Testing defined model", () => {
  test("Ensure no duplicate ids", async () => {
    const err = [];
    const tmp = [];
    for (let i = 0; i < ALL_ASSETS.length; i++) {
      if (tmp.includes(ALL_ASSETS[i].id)) {
        err.push("Duplicate ID: " + ALL_ASSETS[i].id);
      }
      tmp.push(ALL_ASSETS[i].id);
    }
    console.log("Errors: " + JSON.stringify(err));
    expect(err.length).toBe(0);
  });

  const DUPLICATE_CONTRACT_EXCEPTIONS = {
    "0x55D5BCEf2BFD4921B8790525FF87919c2E26bD03": 2,
    "0xC3f393FB40F8Cc499C1fe7FA5781495dc6FAc9E9": 2,
    "0xF125357f05c75F9beEA0Cc721D7a2A0eA03aaa63": 2,
  };

  test("Ensure no duplicate contracts on a single chain", async () => {
    const duplicateContractsFound = {};
    const err = [];
    const tmp = [];
    for (let i = 0; i < ALL_ASSETS.length; i++) {
      const contractKey = ALL_ASSETS[i].contract;
      if (tmp.includes(contractKey)) {
        const allowDuplicateCount =
          DUPLICATE_CONTRACT_EXCEPTIONS[ALL_ASSETS[i].contract];
        const chainAndContract = ALL_ASSETS[i].chain + "-" + contractKey;
        if (allowDuplicateCount !== undefined) {
          const currentCount = duplicateContractsFound[chainAndContract]
            ? duplicateContractsFound[chainAndContract]
            : 0;
          duplicateContractsFound[chainAndContract] = currentCount + 1;
          if (
            duplicateContractsFound[chainAndContract] >
            DUPLICATE_CONTRACT_EXCEPTIONS[chainAndContract]
          ) {
            err.push("Duplicate Contract address: " + chainAndContract);
          }
        } else {
          err.push("Duplicate Contract address: " + chainAndContract);
        }
      }
      tmp.push(contractKey);
    }
    console.log("Errors: " + JSON.stringify(err));
    expect(err.length).toBe(0);
  });


  test("Ensure no assets have forbidden characters in api key", async () => {
    const err = [];
    for (let i = 0; i < ALL_ASSETS.length; i++) {
      if( ALL_ASSETS[i].details && ALL_ASSETS[i].details.apiKey && ALL_ASSETS[i].details.apiKey.includes("/")) {
        err.push(ALL_ASSETS[i].details.apiKey + " must not include a forward slash in the api-key");
      }
    }
    console.log("Errors: " + JSON.stringify(err));
    expect(err.length).toBe(0);
  });

  test("Ensure all active assets have a protocol", async () => {
    const err = [];
    const usedKeys = [];
    for (let i = 0; i < ALL_ASSETS.length; i++) {
      if (ALL_ASSETS[i].enablement !== AssetEnablement.PERMANENTLY_DISABLED) {
        if (ALL_ASSETS[i].details.apiKey === undefined) {
          err.push("Asset " + ALL_ASSETS[i].id + " has no api key");
        }
        if (usedKeys.includes(ALL_ASSETS[i].details.apiKey)) {
          err.push("Asset " + ALL_ASSETS[i].id + " has a duplicate API key");
        }
        if (usedKeys.includes(ALL_ASSETS[i].details.apiKey.toLowerCase())) {
          err.push("Asset " + ALL_ASSETS[i].id + " has a duplicate API key");
        }
        usedKeys.push(ALL_ASSETS[i].details.apiKey);
        usedKeys.push(ALL_ASSETS[i].details.apiKey.toLowerCase());
      }
    }
    console.log("Errors: " + JSON.stringify(err));
    expect(err.length).toBe(0);
  });

  test("Ensure all active assets have a behavior", async () => {
    const err = [];
    const discovery: JarBehaviorDiscovery = new JarBehaviorDiscovery();
    for (let i = 0; i < ALL_ASSETS.length; i++) {
      // TODO farms need to be brought into the fold here
      if (
        ALL_ASSETS[i].enablement !== AssetEnablement.PERMANENTLY_DISABLED &&
        ALL_ASSETS[i].type !== AssetType.STANDALONE_FARM
      ) {
        const behavior = discovery.findAssetBehavior(ALL_ASSETS[i]);
        if (behavior === undefined || behavior === null) {
          err.push(
            "Asset " + ALL_ASSETS[i].id + " has no associated behavior file",
          );
        }
      }
    }
    console.log("Errors: " + JSON.stringify(err));
    expect(err.length).toBe(0);
  });

  test("Ensure all deposit token components are in the external token model", async () => {
    const err = [];
    for (let i = 0; i < ALL_ASSETS.length; i++) {
      const components = ALL_ASSETS[i].depositToken.components;
      if (components) {
        for (let j = 0; j < components.length; j++) {
          const token = ExternalTokenModelSingleton.getToken(
            components[j],
            ALL_ASSETS[i].chain,
          );
          if (token === undefined || token === null) {
            err.push(
              "Token " +
                components[j] +
                " on chain " +
                ALL_ASSETS[i].chain +
                " is not found in the ExternalTokenModel",
            );
          }
        }
      }
    }
    console.log("Errors: " + JSON.stringify(err));
    expect(err.length).toBe(0);
  });
});
