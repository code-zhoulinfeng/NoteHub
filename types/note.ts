/** 笔记实体（来自 GitHub 仓库中的 .md 文件 + frontmatter） */
export interface Note {
  /** 仓库根路径下的相对路径（不含 .md） */
  path: string;
  title: string;
  description: string;
  public: boolean;
  tags: string[];
  /** 展示用更新时间 */
  updated: string;
  /** 更新时间戳（排序用） */
  ts: number;
  /** 最新 commit SHA（短） */
  sha: string;
  commits: number;
  /** 是否有未提交的本地修改 */
  dirty: boolean;
  content: string;
}

/** Git 提交记录 */
export interface Commit {
  sha: string;
  msg: string;
  time: string;
  date: string;
  add: number;
  del: number;
}

/** 用户（GitHub 账号） */
export interface User {
  username: string;
  name: string;
  bio: string;
  joined: string;
}

/** 仓库配置 */
export interface RepoConfig {
  owner: string;
  repo: string;
  branch: string;
  rootPath: string;
}

/** 表格行内的 Diff 行（版本对比页用） */
export interface DiffLine {
  t: string;
  k: "" | "add" | "del";
}
