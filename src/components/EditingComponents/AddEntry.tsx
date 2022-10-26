import { CreateEntryInput } from "../../utils/validation/entries.schema";
interface AddEntryProps {
  tagData: string[];
  categoryData: string[];
  onAdd: (data: CreateEntryInput) => void;
}

export default function AddEntry({
  tagData,
  categoryData,
  onAdd,
}: AddEntryProps) {
  return <div>add new entry modal</div>;
}
