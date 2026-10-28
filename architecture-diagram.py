from diagrams import Diagram, Cluster, Edge
from diagrams.aws.network import VPC, InternetGateway, NATGateway, ALB, RouteTable, ELB
from diagrams.aws.compute import AutoScaling, EC2
from diagrams.aws.general import Client

graph_attr = {
    "fontsize": "22",
    "bgcolor": "white",
    "pad": "0.5",
}

with Diagram(
    "EC2 -> ASG -> ALB -> VPC Build (coach-app)",
    filename="architecture-diagram",
    outformat="png",
    show=False,
    direction="TB",
    graph_attr=graph_attr,
):
    client = Client("Internet client")

    with Cluster("VPC (10.0.0.0/16)"):
        igw = InternetGateway("Internet Gateway")

        with Cluster("Public subnets (2 AZs)"):
            alb = ALB("web-alb\n(custom NACL)")
            tg = ELB("target group\nhealth check: HTTP /")
            nat_a = NATGateway("NAT GW\nus-east-1a")
            nat_b = NATGateway("NAT GW\nus-east-1b")

        with Cluster("Private subnets (2 AZs)"):
            with Cluster("web-asg (min=2, desired=2, max=4)"):
                asg = AutoScaling("ASG\nhealth-check-type: ELB")
                ec2_a = EC2("EC2\n(launch template)")
                ec2_b = EC2("EC2\n(launch template)")

        public_rtb = RouteTable("public RTB\n0.0.0.0/0 -> IGW")
        private_rtb = RouteTable("private RTB\n0.0.0.0/0 -> NAT")

    client >> Edge(label="HTTP") >> igw >> alb
    alb >> Edge(label="forwards to") >> tg
    tg >> Edge(label="routes to") >> ec2_a
    tg >> Edge(label="routes to") >> ec2_b
    asg >> Edge(label="manages / registers", style="dashed") >> ec2_a
    asg >> Edge(label="manages / registers", style="dashed") >> ec2_b
    ec2_a >> Edge(label="outbound only", style="dotted") >> nat_a
    ec2_b >> Edge(label="outbound only", style="dotted") >> nat_b
    nat_a >> igw
    nat_b >> igw
    alb >> Edge(style="dotted", color="gray") >> public_rtb
    ec2_a >> Edge(style="dotted", color="gray") >> private_rtb
