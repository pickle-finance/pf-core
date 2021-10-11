import { PickleModelJson } from "..";
import { getUserJarSummary, IUserEarningsSummary } from "./UserEarnings";

export class UserModel {
    model: PickleModelJson.PickleModelJson;
    walletId: string;
    constructor(model: PickleModelJson.PickleModelJson, walletId: string) {
        this.model = model;
        this.walletId = walletId;
    }

    async getUserEarningsSummary(): Promise<IUserEarningsSummary> {
        return getUserJarSummary(this.walletId.toLowerCase(), this.model);
    }
}