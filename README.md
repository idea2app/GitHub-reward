# GitHub-reward

A free alternative of [IssueHunt.io][1], [Polar.sh][2] & [Gitee reward][3], which builds Developer [DAO][4]s based on Git & GitHub, instead of confusing Block Chain technology.

[![Claim Issue Reward](https://github.com/idea2app/GitHub-reward/actions/workflows/claim-issue-reward.yml/badge.svg)][5]
[![Statistic Member Reward](https://github.com/idea2app/GitHub-reward/actions/workflows/statistic-member-reward.yml/badge.svg)][6]

## Installation

### New repository

Click the [<kbd>Use this template</kbd>][7] button on the top of this GitHub repository's home page to create your own repository.

### Old repository

NPM compatible environment for example:

```shell
npm i pnpm -g
cd /path/to/your/git/repository/root

folders=".github/ISSUE_TEMPLATE .github/workflows .github/scripts"

for folder in $folders; do
    mkdir -p $folder
    cd $folder
    pnpx get-git-folder https://github.com/idea2app/GitHub-reward main $folder
    cd -
done
```

## Usage

1.  The PMs, clients or users of your product should submit **Feature/Enhancement** requests or **Bug** reports with [Issue forms][8], and set the **Reward** value

2.  Your GitOps chat bot (such as [Lark-GitHub-bot][9]) may send an Issue message to your team channel

3.  Your team members should create a **Pull request** with `closes #issue_number` description to claim the reward

4.  After the CI/CD & code review passed, set hardwork reviewers as PR assignees first for reward sharing, then the PR can be merged

5.  GitHub actions will calculate every closed Reward Issue, and save the reward data of all related developers to a Git tag of the merged commit

6.  Every first day of a month, GitHub actions will calculate the reward data of all developers in the last month, and save it to a Git tag & GitHub release of the merged commit

7.  Pay the salary to developers via your convenience

[1]: https://issuehunt.io/
[2]: https://polar.sh/
[3]: https://gitee.com/gitee_reward
[4]: https://en.wikipedia.org/wiki/Decentralized_autonomous_organization
[5]: https://github.com/idea2app/GitHub-reward/actions/workflows/claim-issue-reward.yml
[6]: https://github.com/idea2app/GitHub-reward/actions/workflows/statistic-member-reward.yml
[7]: https://github.com/new?template_name=GitHub-reward&template_owner=idea2app
[8]: https://github.com/idea2app/GitHub-reward/issues/new/choose
[9]: https://github.com/idea2app/Lark-GitHub-bot
