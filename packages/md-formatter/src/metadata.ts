#!/usr/bin/env node

import async from 'async'
import { Tutorial, tutorialDumpDB, tutorialDumpExtendedDB, TutorialExtended } from './data';
import _ from 'lodash';


let count = 0
const writeQueue = async.queue(async (data: TutorialExtended) => {
  await tutorialDumpExtendedDB.read()
  tutorialDumpExtendedDB.chain
    .set(data.slug, data)
    .value()
  await tutorialDumpExtendedDB.write()
  count++
}, 1)

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const parseCsvProtocol = (value: string) => {
  switch (value) {
    case 'thegraph':
      return 'The Graph';
    default:
      return capitalizeFirstLetter(value);
  }
};

export const parseTags = (value: string) => {
  switch (value) {
    case 'Graphql':
      return 'GraphQL';
    case 'Smart Contracts':
      return 'Smart Contract';
    default:
      return capitalizeFirstLetter(value);
  }
};

const parseCsvDifficulty = (value: string) => {
  switch (value) {
    case 'Beginner':
      return 'Beginner';
    case 'Intermediate':
      return 'Beginner';
    case 'Advanced':
      return 'Experienced';
    default:
      return 'Beginner';
  }
};

const extend = async () => {
  await tutorialDumpDB.read()

  tutorialDumpExtendedDB.data = {};
  tutorialDumpExtendedDB.write();
  

  tutorialDumpDB.chain.forEach(async tutorial => {
    // console.log(tutorial.slug)
    const extended: Partial<TutorialExtended> = { ...tutorial }
    const getSLug = () => {
      const protocol = tutorial.tags[0].replace(' ', '').toLowerCase();
      let slug = tutorial.slug
      if (!tutorial.slug.startsWith(protocol)) {
        slug = `${protocol.toLowerCase()}-${slug}`
      }
      return slug
    }

    if (!tutorial?.author_url) {
      extended.author_url = `https://github.com/TheBuilderDAO`
    }

    if (!tutorial?.author_github_account) {
      extended.author_name = 'The Builder Dao'
    } else {
      extended.author_name = tutorial.author_github_account
    }

    if (tutorial.slug === 'celo-ubeswap-tutorial') { // fix outdated link.
      tutorial.pages[0].markdown_url = 'https://raw.githubusercontent.com/figment-networks/learn-tutorials/master/celo/celo-ubeswap-tutorial.md'
    }

    if (tutorial.slug === 'token-contracts') {
      tutorial.pages[0].markdown_url = 'https://raw.githubusercontent.com/figment-networks/learn-tutorials/master/tezos/token-contracts.md'
    }

    if (tutorial.slug === 'avalanche-deploy-pangolin-to-local-testnet') {
      tutorial.pages[0].markdown_url = 'https://raw.githubusercontent.com/figment-networks/learn-tutorials/master/avalanche/deploy-pangolin-to-local-testnet-with-token-pair.md'
    }

    if (tutorial.slug === 'deploy-pangolin-to-your-local-testnet-and-create-token-pair') {
      tutorial.pages[0].markdown_url = 'https://raw.githubusercontent.com/figment-networks/learn-tutorials/master/avalanche/deploy-pangolin-to-your-local-testnet-and-create-token-pair.md'
    }

    extended.slug = getSLug()
    extended.author_github_account = extended.author_url?.replace(/^https:\/\/github.com\//, ''),
    extended.author_image_url = extended.author_url?.includes('github.com') ? `${extended.author_url}.png`: "";
    extended.oldSlug = tutorial.slug;
    extended.tags = tutorial.tags.map(parseTags)

    if (extended.oldSlug !== extended.slug) {
      console.log(`${tutorial.slug} -> ${extended.slug}`)
    }
    const sortedObject = extended as TutorialExtended
    await writeQueue.pushAsync(sortedObject)
    console.log(sortedObject)
  }).value()
  if (writeQueue.length() > 0) {
    await writeQueue.drain()
  }
  console.log(`${count}/${tutorialDumpDB.data?.length} tutorials`)
}

extend().then(() => {
  console.log("#".repeat(20), "done", "#".repeat(20),)
})

// interface TutorialsCsvRow {
//   slug: string,
//   protocol: string,
//   title: string,
//   description: string,
//   markdown_url: string,
//   author: string,
//   author_url: string,
//   tags: string,
//   difficulty_level: string
// }


// const generateMetadata = async () => {
//   console.log('#'.repeat(80))
//   tutorialDetailDB.data = {}
//   await tutorialDetailDB.write()
//   return new Promise<void>((resolve, reject) => {
//     fs.createReadStream(path.resolve(__dirname, '../src/tutorials-dump.csv'))
//       .pipe(csv.parse({ headers: true }))
//       .pipe(
//         csv.format<TutorialsCsvRow, TutorialDetailsRow>({ headers: true }),
//       )
//       .transform(async (row, next): Promise<void> => {
//         count = count + 1;
//         if (!row.author_url.startsWith('https://github.com')) {
//           row.author_url = `https://github.com/TheBuilderDAO`
//           row.author = 'TheBuilderDAO'
//         }
//         const markdown_path = row.markdown_url.split('/master/')[1]
//         const folder = markdown_path.replace('.md', '').replace('/', '-')
//         const getSLug = () => {
//           let slug = row.slug
//           if (!row.slug.startsWith(row.protocol)) {
//             slug = `${row.protocol.toLowerCase()}-${slug}`
//           }
//           return slug
//         }
//         const tags = _.uniq([row.protocol, ...row.tags.split(';')
//           .map(tag => tag.trim())
//           .filter(tag => tag.length > 0)])
//           .map(parseTags)

//         const extended = {
//           ...row,
//           slug: getSLug(),
//           oldSlug: row.slug,
//           folderSlug: folder,
//           protocol: parseCsvProtocol(row.protocol),
//           tags,
//           markdown_path,
//           difficulty_level: parseCsvDifficulty(row.difficulty_level),
//           author_nickname: row.author_url.replace(/^https:\/\/github.com\//, ''),
//           author_image_url: `${row.author_url}.png`,
//         }
//         await writeQueue.pushAsync(extended)
//         next(null, extended)
//       })
//       .pipe(process.stdout)
//       .on('end', async () => {
//         if (writeQueue.length() > 0) {
//           await writeQueue.drain();
//         }
//         resolve()
//       })
//   })
// }

// generateMetadata().then(async () => {
//   const a = await fs.readJson(target)
//   console.log(
//     Object.keys(a).length
//   )
//   // await fs.copy(source, target, { filter: filterFunc })
//   console.log('done')
// })




