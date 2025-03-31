import { Button } from "@mui/material";

export default function Navbar(props: NavbarProps) {

    function handleExport() {
        console.log("not implemented");
    };

    return (
        <div>
            <Button variant="contained" onClick={handleExport}>Export</Button>
            <div className="input-group">
                <label htmlFor="input">Import XML</label>
                <input id='input' type="file" onChange={props.handleFileChange} />
                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" value={xmlDoc}/> */}
            </div>
        </div>
    );
}

export type NavbarProps = {
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}