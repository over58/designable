import ghRelease from 'gh-release'
import fs from 'fs-extra'
import path from 'path'
import dayjs from 'dayjs'
import { compareTwoStrings } from 'string-similarity'
// import {
//   listCommits,
//   lastTag,
//   getPreviousTag,
//   getCurrentBranch,
//   getGithubToken,
//   getSortableAllTags,
//   getTaggedTime,
// } from './git'
import { execa, execaSync } from 'execa'
import semver from 'semver'

export async function changedPaths(sha: string): Promise<string[]> {
  const result = await execa('git', [
    'show',
    '-m',
    '--name-only',
    '--pretty=format:',
    '--first-parent',
    sha,
  ])
  return result.stdout.split('\n')
}

export function getSortableAllTags() {
  return execaSync('git', ['tag', '-l'])
    .stdout.split(/\n/)
    .sort((a, b) => {
      const v1 = a.replace(/^v/, '')
      const v2 = b.replace(/^v/, '')
      return semver.gte(v1, v2) ? -1 : 1
    })
}

export function getCurrentBranch() {
  return execaSync('git', ['branch', '--show-current']).stdout
}

export function getTaggedTime(tag: string) {
  return execaSync('git', ['log', '-1', '--format=%ai', tag]).stdout
}

export function getGithubToken() {
  return process.env.GITHUB_AUTH
}
/**
 * All existing tags in the repository
 */
export function listTagNames(): string[] {
  return execaSync('git', ['tag']).stdout.split('\n').filter(Boolean)
}

/**
 * The latest reachable tag starting from HEAD
 */
export function lastTag(): string {
  return execaSync('git', ['describe', '--abbrev=0', '--tags']).stdout
}

export function getPreviousTag(current: string): string {
  return execaSync('git', ['describe', '--abbrev=0', '--tags', current + '^'])
    .stdout
}

export interface CommitListItem {
  sha: string
  refName: string
  summary: string
  date: string
  author: string
}

export function parseLogMessage(commit: string): CommitListItem | null {
  const parts =
    commit.match(
      /hash<(.+)> ref<(.*)> message<(.*)> date<(.*)> author<(.*)>/
    ) || []

  if (!parts || parts.length === 0) {
    return null
  }

  return {
    sha: parts[1],
    refName: parts[2],
    summary: parts[3],
    date: parts[4],
    author: parts[5],
  }
}

export function listCommits(from: string, to = ''): CommitListItem[] {
  // Prints "hash<short-hash> ref<ref-name> message<summary> date<date>"
  // This format is used in `getCommitInfos` for easily analize the commit.
  return execaSync('git', [
    'log',
    '--oneline',
    '--pretty="hash<%h> ref<%D> message<%s> date<%cd> author<%an>"',
    '--date=short',
    `${from}..${to}`,
  ])
    .stdout.split('\n')
    .filter(Boolean)
    .map(parseLogMessage)
    .filter((item): item is CommitListItem => !!item)
}

import { fileURLToPath } from 'url'
const __filenameNew = fileURLToPath(import.meta.url)
const __dirnameNew = path.dirname(__filenameNew)
const LernaJSON = fs.readJSONSync(
  path.resolve(__dirnameNew, '../../lerna.json')
)

const ReleaseTitle = 'Designable Release 🚀'

const GithubRepo = 'https://github.com/over58/designable'

const CommitGroupBy: Array<[string, string[]]> = [
  [':tada: Enhancements', ['feat', 'features', 'feature']],
  [':beetle: Bug Fixes', ['bug', 'bugfix', 'fix']],
  [':boom: Breaking Changes', ['breaking', 'break']],
  [':memo: Documents Changes', ['doc', 'docs']],
  [':rose: Improve code quality', ['refactor', 'redesign']],
  [':rocket: Improve Performance', ['perf']],
  [':hammer_and_wrench: Update Workflow Scripts', ['build']],
  [':construction: Add/Update Test Cases', ['test']],
  [':blush: Other Changes', ['chore']],
]

const isPublishMessage = (str: string) => {
  if (/chore\(\s*(?:versions?|publish)\s*\)/.test(str)) return true
  return /publish v?(?:\d+)\.(?:\d+)\.(?:\d+)/.test(str)
}

const getCurrentChanges = (from = lastTag(), to = 'HEAD') => {
  const summarys: string[] = []
  return listCommits(from, to).filter(({ summary }) => {
    if (summarys.some((target) => compareTwoStrings(target, summary) > 0.5))
      return false
    if (isPublishMessage(summary)) return false
    summarys.push(summary)
    return true
  })
}

const getGroupChanges = (from = lastTag(), to = 'HEAD') => {
  const changes = getCurrentChanges(from, to)
  const results: Array<[string, string[]]> = CommitGroupBy.map(([group]) => [
    group,
    [],
  ])
  changes.forEach(({ summary, author, sha }) => {
    for (const [group, value] of CommitGroupBy) {
      if (value.some((target) => new RegExp(target).test(summary))) {
        results.forEach((item) => {
          if (item[0] === group) {
            item[1].push(
              `[${summary}](${GithubRepo}/commit/${sha}) :point_right: ( [${author}](https://github.com/${author}) )`
            )
          }
        })
      }
    }
  })
  return results.filter(([, value]) => {
    return value.length > 0
  })
}

const createChangelog = (from = lastTag(), to = 'HEAD') => {
  const isHead = to === 'HEAD'
  const headVersion = isHead ? LernaJSON?.version : to
  const changes = getGroupChanges(from, to)
  const nowDate = isHead
    ? dayjs().format('YYYY-MM-DD')
    : dayjs(getTaggedTime(to), 'YYYY-MM-DD').format('YYYY-MM-DD')
  const log = changes
    .map(([group, contents]) => {
      return `
### ${group}
${contents
  .map((content) => {
    return `
1. ${content}    
`
  })
  .join('')}  
`
    })
    .join('')
  return `
## ${headVersion}(${nowDate})

${log ? log : '### No Change Log'}
`
}

const isPrerelease = (tag: string) => {
  return /(?:beta|rc|alpha)/.test(tag)
}

const createReleaseNote = () => {
  const to = lastTag()
  const from = getPreviousTag(to)
  const body = createChangelog(from, to)
  const branch = getCurrentBranch()
  const token = getGithubToken()
  return new Promise((resolve, reject) => {
    ghRelease(
      {
        cli: true,
        tag_name: to,
        target_commitish: branch,
        name: `${ReleaseTitle} - ${to}`,
        body,
        draft: false,
        prerelease: isPrerelease(to),
        owner: 'alibaba',
        repo: 'designable',
        endpoint: 'https://api.github.com',
        auth: {
          token,
        },
      },
      (err: unknown, response: unknown) => {
        if (err) {
          reject()
        } else {
          resolve(response)
        }
      }
    )
  })
}

const generateChangeLogFile = () => {
  const tags = getSortableAllTags()
  const file = `
# Changelog
${tags
  .slice(0, 40)
  .map((newer, index) => {
    const older = tags[index + 1]
    if (older) {
      return createChangelog(older, newer)
    }
    return ''
  })
  .join('')}  
`
  fs.writeFileSync(
    path.resolve(__dirnameNew, '../../CHANGELOG.md'),
    file,
    'utf8'
  )
}

if (process.argv.includes('release')) {
  createReleaseNote()
  console.log('🎉：Release Note upload success!')
} else if (process.argv.includes('changelog')) {
  generateChangeLogFile()
  console.log('🎉：Changelog generate success!')
}
