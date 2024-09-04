import { NextApiRequest, NextApiResponse } from 'next'
import { Octokit } from 'octokit'

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try {
        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
        const issues = await octokit.rest.issues.listForRepo({
            owner: 'amitjha329',
            repo: 'ecom-web-app',
            state: 'all'
        })
        res.json(issues.data)
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}