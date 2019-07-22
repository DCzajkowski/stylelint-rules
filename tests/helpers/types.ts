export interface Warning {
  line: number;
  column: number;
  rule: string;
  severity: 'error';
  text: string;
}
