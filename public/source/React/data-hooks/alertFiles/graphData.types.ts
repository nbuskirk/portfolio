// This is not accurate, its just a guess at the type
export type GraphData = Array<GraphDataInstance>;

export interface GraphDataInstance {
  title: string;
  data: Array<{
    count: number;
    label: string;
  }>;
}
