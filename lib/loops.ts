import { LoopsClient } from "loops";
import { env } from "@/config/env.mjs";

export const loops = new LoopsClient(env.LOOPS_API_KEY);
