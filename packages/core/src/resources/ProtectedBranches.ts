import { BaseResource } from '@gitbeaker/requester-utils';
import {
  BaseRequestOptions,
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
} from '../infrastructure';

export interface ProtectedBranchAccessLevel {
  access_level: 0 | 30 | 40 | 60;
  access_level_description: string;
  user_id?: number;
  group_id?: number;
}

export interface ProtectedBranchSchema extends Record<string, unknown> {
  id: number;
  name: string;
  push_access_levels?: ProtectedBranchAccessLevel[];
  merge_access_levels?: ProtectedBranchAccessLevel[];
  allow_force_push: boolean;
  code_owner_approval_required: boolean;
}

export class ProtectedBranches<C extends boolean = false> extends BaseResource<C> {
  all(projectId: string | number, options: { search?: string } & PaginatedRequestOptions = {}) {
    const pId = encodeURIComponent(projectId);

    return RequestHelper.get<ProtectedBranchSchema[]>()(
      this,
      `projects/${pId}/protected_branches`,
      options,
    );
  }

  protect(projectId: string | number, branchName: string, options?: BaseRequestOptions) {
    const pId = encodeURIComponent(projectId);

    return RequestHelper.post<ProtectedBranchSchema>()(this, `projects/${pId}/protected_branches`, {
      query: {
        name: branchName,
        ...options,
      },
    });
  }

  show(projectId: string | number, branchName: string, options?: Sudo) {
    const [pId, bName] = [projectId, branchName].map(encodeURIComponent);

    return RequestHelper.get<ProtectedBranchSchema>()(
      this,
      `projects/${pId}/protected_branches/${bName}`,
      options,
    );
  }

  unprotect(projectId: string | number, branchName: string, options?: Sudo) {
    const [pId, bName] = [projectId, branchName].map(encodeURIComponent);

    return RequestHelper.del()(this, `projects/${pId}/protected_branches/${bName}`, options);
  }
}
