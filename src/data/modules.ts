import { parseModuleContent } from "@/lib/parseModuleContent"
import type { Module } from "@/types"
import ec2Raw from "./content/ec2.txt?raw"
import asgRaw from "./content/asg.txt?raw"
import albNlbRaw from "./content/alb-nlb.txt?raw"
import vpcRaw from "./content/vpc.txt?raw"
import terraformRaw from "./content/terraform.txt?raw"

export const seedModules: Module[] = [
  parseModuleContent(ec2Raw),
  parseModuleContent(asgRaw),
  parseModuleContent(albNlbRaw),
  parseModuleContent(vpcRaw),
  parseModuleContent(terraformRaw),
]
