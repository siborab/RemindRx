{
  description = "Computer Vision OCR Project Flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let 
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            (final: prev: {
              python = prev.python3; # Use Python 3
            })
          ];
        };

        pythonPackages = pkgs.python.pkgs;

        # Define a derivation for the supabase package from PyPI.
        supabase = pythonPackages.buildPythonPackage rec {
          pname = "supabase";
          version = "2.13.0";  # Replace with the desired version from PyPI
          src = pkgs.fetchPypi {
            inherit pname version;
            # Replace the sha256 with the one computed for that version.
            sha256 = "sha256-RSV000vZeMjRG18CsBgrSOiFTlEclpSDyDh17AFJXxE=";
          };
          format = "pyproject";
          usePep517 = true;
          nativeBuildInputs = [ pythonPackages.poetry-core ];

          # pythonRuntimeDepsCheckHook = "";
          # checkPhase = "echo 'Skipping runtime dependency check'";
          meta = with pkgs.lib; {
            description = "Supabase Python client library";
            license = licenses.mit;
          };
        };

        my-python-env = pkgs.python.withPackages (ps: with ps; [
          numpy
          opencv4
          pillow
          pytesseract
          scikit-learn
          pytest
          pytest-cov
          pandas
          python-dotenv
          pip
          supabase  # Add the custom supabase package here
        ]);

      in {
        devShells = {
          default = pkgs.mkShell {
            buildInputs = [
              my-python-env
              pkgs.tesseract
              pkgs.git
            ];

            shellHook = ''
              export PATH="$HOME/.local/bin:$PATH"
            '';
          };
        };

        packages = {
          default = my-python-env;
        };
      }
    );
}
