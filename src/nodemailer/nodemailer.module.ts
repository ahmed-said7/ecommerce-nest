import { Module } from "@nestjs/common";
import { NodemailerServices } from "./nodemailer.services";

@Module({
    exports:[NodemailerServices],
    providers:[NodemailerServices]
})
export class NodemailerModule {};