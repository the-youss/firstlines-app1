export type Person = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
};
// @ts-ignore
export const data = new Array<Person>(2500).fill('').map((_, idx) => ({

  name: `Name ${idx}`,
  title: `Title ${idx}`,
  company: `Company ${idx}`,
  country: `Country ${idx}`,
  industry: `Industry ${idx}`,
  source: `Source ${idx}`,
  list: `List ${idx}`,
  campaign: `Campaign ${idx}`,
}))
