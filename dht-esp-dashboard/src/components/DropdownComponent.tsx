import Dropdown from 'react-bootstrap/Dropdown';

type DropDownItem = {
  key: string;
  label: string;
}

type DropdownComponentProps = {
  items: DropDownItem[];
  selectedItem: string;
  onSelectItem: (key: string) => void;
};

function DropdownComponent({ items, selectedItem, onSelectItem }: DropdownComponentProps) {
  const selected = items.find((item) => item.key === selectedItem);

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {selected ? selected.label : "Select an option"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {items.map((item) => (
          <Dropdown.Item
            key={item.key}
            active={item.key === selectedItem}
            onClick={() => onSelectItem(item.key)}
          >
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownComponent;