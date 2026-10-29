import { parseModuleContent } from "@/lib/parseModuleContent"
import type { Module } from "@/types"
import ec2Raw from "./content/ec2.txt?raw"
import asgRaw from "./content/asg.txt?raw"
import albNlbRaw from "./content/alb-nlb.txt?raw"
import vpcRaw from "./content/vpc.txt?raw"
import terraformPart1Raw from "./content/terraform-part1.txt?raw"
import terraformPart2Raw from "./content/terraform-part2.txt?raw"

export const seedModules: Module[] = [
  parseModuleContent(ec2Raw),
  parseModuleContent(asgRaw),
  parseModuleContent(albNlbRaw),
  parseModuleContent(vpcRaw),
  parseModuleContent(terraformPart1Raw),
  parseModuleContent(terraformPart2Raw),
]
