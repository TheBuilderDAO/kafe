import path from 'path';
import async from "async";

import { TutorialContent } from "@builderdao/apis";
import { getTutorialContentByPath } from "@builderdao/md-utils";
import { BuilderDaoConfig } from "src/services";
import { hashSumDigest } from "src/utils";

export async function updateHashDigestOfFolder(rootFolder: string) {
  const tutorialMetadata = await getTutorialContentByPath({
    rootFolder,
  });
  const { lock: db } = new BuilderDaoConfig(rootFolder);
  await db.read();
  const hashQueue = async.queue(
    async (file: { path: string; name: string; digest: string, arweaveHash?: string }) => {
      const digest = await hashSumDigest(file.path);
      const relativePath = path.relative(rootFolder, file.path);
      const prev = db.chain.get(`content["${relativePath}"]`).value();
      db.chain
        .set(`content["${relativePath}"]`, {
          ...prev,
          name: file.name,
          path: relativePath,
          digest,
        })
        .value();
      await db.write();
    },
    2,
  );
  tutorialMetadata.content.forEach(file => {
    hashQueue.push(file as TutorialContent);
  });
  await hashQueue.drain();
}