import axios, { AxiosInstance } from 'axios';

class GitHubApi {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.github.com/',
      timeout: 1000,
    });
  }

  async triggerWorkflow(slug: string): Promise<void> {
    // TODO: Get owner and repo
    const owner = '';
    const repo = '';
    const workflowId = 'publish.yaml';
    await this.client.post(
      `/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`,
      {
        inputs: {
          slug,
        },
      },
    );
  }
}

export default GitHubApi;
