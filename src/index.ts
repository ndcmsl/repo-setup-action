import * as core from '@actions/core';
import * as github from '@actions/github';

const main = async () => {
  const owner = core.getInput('owner', { required: true });
  const repo = core.getInput('repo', { required: true }).split('/')[1];
  const token = core.getInput('token', { required: true});
  const topic = core.getInput('topic');
  const octokit = github.getOctokit(token);
  const protectionConfig = {
    owner,
    repo,
    required_status_checks: null,
    required_pull_request_reviews: {
      require_code_owner_reviews: true,
      required_approving_review_count: 1,
      dismiss_stale_reviews: true,
      dismissal_restrictions: {}
    },
    enforce_admins: false,
    restrictions: null
  }

  octokit.rest.repos.updateBranchProtection({ ...protectionConfig, branch: 'main' });
  octokit.rest.repos.updateBranchProtection({ ...protectionConfig, branch: 'dev' });
  octokit.rest.repos.replaceAllTopics({
    owner,
    repo,
    names: [topic]
  });
  octokit.rest.teams.addOrUpdateRepoPermissionsInOrg({
    owner,
    repo,
    org: owner,
    team_slug: 'backend',
    permission: 'push'
  });
}

main();