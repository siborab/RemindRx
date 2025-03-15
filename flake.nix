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

        my-python-env = pkgs.python.withPackages (ps: with ps; [
          numpy
          opencv4
          pillow
          pytesseract
          scikit-learn
          pytest
          pytest-cov
        ]);

      in {
        devShells = {
          x86_64-linux.default = pkgs.mkShell {
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

        packages.x86_64-linux.default = my-python-env;
      }
    );
}

