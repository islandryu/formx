export type IndexObject<T = any> = {
  [key: string]: T;
};

export type Config = IndexObject<FieldConfig>;

export type Error = string | undefined;

export type Context = IndexObject;

export type FormProp = {
  values: IndexObject;
  errors: IndexObject<Error>;
};

export type FieldConfig<Props = any> = {
  component: React.FC<Props>;
  props: (context: Context, form: FormProp) => IndexObject;
  deps?: string[];
  initState?: (
    context: Context
  ) => {
    value?: any;
    error?: string | undefined;
  };
};