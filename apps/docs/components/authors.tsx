import React from 'react';
import { GraphQLClient } from 'graphql-request';
import useSWR from 'swr';
import Image from 'next/image';
import { formatDistance } from 'date-fns';

const useAuthors = path => {
  const client = new GraphQLClient('https://api.github.com/graphql');
  client.setHeaders({
    Authorization: `bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
  });
  const fetcher = (url, path) => {
    if (!path) return;
    return client
      .request(
        `
      query {
        repository(name: "kafe" owner: "TheBuilderDAO") {
          ref(qualifiedName: "dev") {
            target {
              ... on Commit {
                history(first: 100, path: "${path}",  ) {
                  edges {
                    node {
                      author {
                        user {
                          id
                          name
                          login
                          avatarUrl
                          url
                        }
                        date
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      `,
      )
      .then(data =>
        data.repository.ref.target.history.edges
          .map(edge => edge.node)
          .reduce((acc, node) => {
            if (node.author.user.id !== acc[node.author.user.id]) {
              acc[node.author.user.login] = {
                ...node.author.user,
                date: node.author.date,
              };
            }
            return acc;
          }, {}),
      )
      .then(data => Object.values(data).reverse());
  };
  const { data, error } = useSWR(['/api/user', path], fetcher);
  return {
    data,
    error,
    loading: !data && !error,
  };
};

const Authors = ({ path }) => {
  const { data } = useAuthors(path);
  return (
    <div className="flex items-center p-4 -space-x-2 overflow-hidden ">
      <span className="mr-6 dark:text-gray-600">Last Edited by</span>
      {data &&
        data.map((author: AuthorProps) => (
          <Author key={author.id} author={author} />
        ))}
    </div>
  );
};
type AuthorProps = {
  id: string;
  name: string;
  login: string;
  avatarUrl: string;
  date: string;
  url: string;
};
export const Author: React.FC<{ author: AuthorProps }> = ({ author }) => {
  const when = formatDistance(new Date(author.date), Date.now(), {
    addSuffix: true,
  });
  return (
    <a
      key={author.id}
      href={author.url}
      target="_blank"
      title={`Edited at ${when} by ${author.name}`}
      className="relative z-30 inline-block w-10 h-10 rounded-full ring-2 ring-white"
      rel="noreferrer"
    >
      <Image
        src={author.avatarUrl}
        alt={author.name}
        width={'100%'}
        height={'100%'}
        className="relative z-30 inline-block w-6 h-6 rounded-full ring-2 ring-white"
      />
    </a>
  );
};

export default Authors;
