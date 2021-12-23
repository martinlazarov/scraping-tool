import * as shell from "shelljs";

// Copy all the view templates
shell.echo('Updating /dist');
shell.cp( "-Ru", ["src/views", "public"], "dist/src" );
shell.echo('/dist updated!');