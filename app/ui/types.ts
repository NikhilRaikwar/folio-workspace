export type Person={id:string;name:string;email:string;initials:string;color:string};
export type RichNode={type:string;text?:string;attrs?:Record<string,unknown>;marks?:{type:string}[];content?:RichNode[]};
export type DocumentRecord={id:string;title:string;excerpt:string;content:RichNode;revision:number;createdAt:string;updatedAt:string;role:'owner'|'editor'|'viewer';owner:Person};
export type Grant={user_id:string;role:'editor'|'viewer';name:string;email:string;initials:string;color:string};
export type Api=<T=unknown>(path:string,options?:RequestInit)=>Promise<T>;
export class ApiError extends Error{status:number;constructor(message:string,status:number){super(message);this.status=status;}}
