cmake_minimum_required(VERSION 3.8)
project(react-wasm-demo)

# Use C++17 standard
set(CMAKE_CXX_STANDARD 17)

# calc.cxx lives in the same directory as this CMakeLists.txt
set(SOURCE_FILE ${CMAKE_SOURCE_DIR}/calc.cxx)

# Output goes to public/ in the project root (one level up from embinding/)
set(OUTPUT_DIR  ${CMAKE_SOURCE_DIR}/../public)

if(EMSCRIPTEN)
  # Use emcc directly via add_custom_command since Emscripten
  # works best with explicit output control for WASM targets
  add_custom_command(
    OUTPUT ${OUTPUT_DIR}/calc.js
    COMMAND emcc
      ${SOURCE_FILE}
      -o ${OUTPUT_DIR}/calc.js  # emcc infers calc.wasm from the .js output name
      -lembind                  # enable Embind to expose C++ functions to JS
      -O2                       # optimize — without this WASM runs unoptimized while JS benefits from JIT
      -s MODULARIZE=1           # wrap output in a factory function instead of running on load
      -s EXPORT_NAME="createModule"  # name the factory function window.createModule()
      -s ENVIRONMENT=web        # strip Node.js-only code, target browser only
    DEPENDS ${SOURCE_FILE}      # rebuild if calc.cxx changes
  )

  # top-level target so `ninja` builds calc.js by default
  add_custom_target(calc ALL DEPENDS ${OUTPUT_DIR}/calc.js)

else()
  # Native build (non-Emscripten) — builds a static library for local dev/testing
  add_library(calc STATIC ${SOURCE_FILE})
endif()