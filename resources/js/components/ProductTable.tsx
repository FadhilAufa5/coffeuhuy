import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Eye } from 'lucide-react';


const getTypeColor = (type: string) => {
  switch(type) {
    case 'Coffee': return 'bg-yellow-700/20 text-yellow-800';
    case 'Non-Coffee': return 'bg-blue-200 text-blue-800';
    case 'Snack': return 'bg-green-200 text-green-800';
    case 'Pastry': return 'bg-pink-200 text-pink-800';
    case 'Heavy Meal': return 'bg-red-200 text-red-800';
    default: return 'bg-gray-200 text-gray-800';
  }
};
// ======== Table Components ========
const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>((props, ref) => (
  <div className="overflow-x-auto w-full">
    <table ref={ref} className={cn('w-full caption-bottom text-sm border-collapse', props.className)} {...props} />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>((props, ref) => <thead ref={ref} {...props} />);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>((props, ref) => <tbody ref={ref} {...props} />);
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>((props, ref) => (
  <tr ref={ref} className={cn('border-b transition-colors hover:bg-gray-50', props.className)} {...props} />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>((props, ref) => (
  <th ref={ref} className={cn('h-12 px-4 text-left align-middle font-medium text-gray-700', props.className)} {...props} />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>((props, ref) => (
  <td ref={ref} className={cn('p-4 align-middle', props.className)} {...props} />
));
TableCell.displayName = 'TableCell';

// ======== Product Table Component ========
export interface Product {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  image?: string;
}

interface Props {
  products: Product[];
  onView: (product: Product) => void;
  onDelete: (product: Product) => void; 
  filterType: string;
  setFilterType: (type: string) => void;
}

export default function ProductTable({ products, onView, onDelete, filterType, setFilterType }: Props) {
  const types = ['All', 'Coffee', 'Non-Coffee', 'Snack', 'Pastry', 'Heavy Meal'];

  const filteredProducts = useMemo(() => {
    if (filterType === 'All') return products;
    return products.filter(p => p.type === filterType);
  }, [filterType, products]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Products</h2>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border rounded p-2"
        >
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Foto</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
       <TableBody>
  {filteredProducts.length ? filteredProducts.map(p => (
    <TableRow key={p.id}>
      <TableCell>
        {p.image ? <img src={`/storage/${p.image}`} className="h-16 w-16 object-cover rounded" /> : '-'}
      </TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getTypeColor(p.type)}`}>
          {p.type}
        </span>
      </TableCell>
      <TableCell>Rp {p.price.toLocaleString()}</TableCell>
     <TableCell>
  <div className="flex items-center justify-start gap-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onView(p)}
      className="text-blue-600 hover:text-blue-800 p-1 flex items-center justify-center"
    >
      <Eye className="h-5 w-5" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onDelete(p)}
      className="text-red-600 hover:text-red-800 p-1 flex items-center justify-center"
    >
      <Trash2 className="h-5 w-5" />
    </Button>
  </div>
</TableCell>

    </TableRow>
  )) : (
    <TableRow>
      <TableCell colSpan={5} className="text-center text-gray-500 p-4">
        Belum ada produk
      </TableCell>
    </TableRow>
  )}
</TableBody>

      </Table>
    </div>
  );
}
