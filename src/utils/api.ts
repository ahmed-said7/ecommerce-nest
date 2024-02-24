import { Global, Module } from "@nestjs/common";
import { apiFactory } from "./api.factory";

@Global()
@Module({
    providers: [apiFactory],
    exports:[apiFactory]
})

export class apiModule {};