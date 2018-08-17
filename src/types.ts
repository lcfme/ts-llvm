import * as llvm from "llvm-node";
import * as ts from "typescript";
import { LLVMGenerator } from "./codegen/generator";
import { error } from "./diagnostics";

export function getLLVMType(type: ts.Type, generator: LLVMGenerator): llvm.Type {
  const { context, module, checker } = generator;
  // tslint:disable:no-bitwise

  if (type.flags & ts.TypeFlags.Boolean) {
    return llvm.Type.getInt1Ty(context);
  }

  if (type.flags & ts.TypeFlags.Number) {
    return llvm.Type.getDoubleTy(context);
  }

  if (type.flags & ts.TypeFlags.String) {
    return getStringType(context);
  }

  if (type.flags & ts.TypeFlags.Object) {
    const elements = checker.getPropertiesOfType(type).map(property => {
      const propertyDeclaration = property.declarations[0];
      switch (propertyDeclaration.kind) {
        case ts.SyntaxKind.PropertyAssignment:
          return getLLVMType(checker.getTypeAtLocation(propertyDeclaration as ts.PropertyAssignment), generator);
        case ts.SyntaxKind.PropertyDeclaration:
          return getLLVMType(checker.getTypeAtLocation(propertyDeclaration as ts.PropertyDeclaration), generator);
        default:
          return error(`Unhandled ts.Declaration '${ts.SyntaxKind[propertyDeclaration.kind]}'`);
      }
    });

    const declaration = type.symbol.declarations[0];
    let struct: llvm.StructType | null;

    if (ts.isClassDeclaration(declaration)) {
      const name = declaration.name!.text;
      struct = module.getTypeByName(name);
      if (!struct) {
        struct = llvm.StructType.create(context, name);
        struct.setBody(elements);
      }
    } else {
      struct = llvm.StructType.get(context, elements);
    }

    return struct.getPointerTo();
  }

  if (type.flags & ts.TypeFlags.Void) {
    return llvm.Type.getVoidTy(context);
  }

  if (type.flags & ts.TypeFlags.Any) {
    return error("'any' type is not supported");
  }

  // tslint:enable:no-bitwise
  return error(`Unhandled ts.Type '${checker.typeToString(type)}'`);
}

let stringType: llvm.StructType | undefined;

export function getStringType(context: llvm.LLVMContext): llvm.StructType {
  if (!stringType) {
    stringType = llvm.StructType.create(context, "string");
    stringType.setBody([llvm.Type.getInt8PtrTy(context), llvm.Type.getInt32Ty(context)]);
  }
  return stringType;
}
