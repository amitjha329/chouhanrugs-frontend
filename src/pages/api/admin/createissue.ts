import { NextApiRequest, NextApiResponse } from "next/types"
import { Octokit } from "octokit";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const octoKit = new Octokit({ auth: process.env.GITHUB_TOKEN })
    console.log(req.body)
    octoKit.rest.issues.create({
        owner: "amitjha329",
        repo: "ecom-web-app",
        title: req.body.title,
        body: req.body.body
    }).then(result => {
        res.status(200).json({ msg: "ok", result })
    }).catch(err => {
        res.status(500).json({ error: "failed to add entry", err })
    })
}

export default handler