const axios = require("axios");

const DEFAULT_RESULT = {
  githubUsername: null,
  totalRepos: 0,
  totalStars: 0,
  topLanguages: [],
  hasOpenSourceContribs: false,
  accountAgeDays: 0,
  totalCommits: 0,
};

async function collectGithubData(githubUsername) {
  if (!githubUsername || githubUsername.trim() === "") {
    return { ...DEFAULT_RESULT };
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const headers = {};
    if (token) {
      headers["Authorization"] = `token ${token}`;
    }

    const [userRes, reposRes, commitsRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${githubUsername}`, { headers }),
      axios.get(
        `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
        { headers }
      ),
      axios.get(
        `https://api.github.com/search/commits?q=author:${githubUsername}&per_page=1`,
        {
          headers: {
            ...headers,
            Accept: "application/vnd.github.cloak-preview",
          },
        }
      ),
    ]);

    const user = userRes.data;
    const repos = reposRes.data;
    const totalCommits = commitsRes.data.total_count || 0;

    const totalRepos = repos.length;
    const totalStars = repos.reduce(
      (sum, repo) => sum + (repo.stargazers_count || 0),
      0
    );

    const langMap = {};
    for (const repo of repos) {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    }
    const topLanguages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => lang);

    const hasOpenSourceContribs = repos.some((repo) => repo.fork === true);

    const accountAgeDays = Math.floor(
      (Date.now() - new Date(user.created_at).getTime()) / 86400000
    );

    return {
      githubUsername,
      totalRepos,
      totalStars,
      topLanguages,
      hasOpenSourceContribs,
      accountAgeDays,
      totalCommits,
    };
  } catch (error) {
    console.error("GitHub collector error:", error.message);
    return { ...DEFAULT_RESULT, githubUsername };
  }
}

module.exports = { collectGithubData };
